import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Avatar,
	TextField,
	InputAdornment,
	CircularProgress,
	Paper,
	Chip,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Send as SendIcon,
	Image as ImageIcon,
	MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useChatStore, Message } from '../stores/chatStore';
import { chatApi, uploadApi } from '../services/api';
import { socketService } from '../services/socket';
import { useLocationStore } from '../stores/locationStore';

export default function Chat() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const { currentMessages, setMessages, addMessage, typingUsers, setTyping } = useChatStore();
	const nearbyUsers = useLocationStore((state) => state.nearbyUsers);

	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);
	const [otherUser, setOtherUser] = useState<any>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (userId) {
			loadConversation();
			setupSocket();

			// Encontrar info do usuário nos usuários próximos
			const user = nearbyUsers.find((u) => u.userId === userId);
			if (user) {
				setOtherUser(user);
			}
		}

		return () => {
			const socket = socketService.getChatSocket();
			socket?.off('newMessage');
			socket?.off('userTyping');
			socket?.off('messageRead');
		};
	}, [userId]);

	useEffect(() => {
		scrollToBottom();
	}, [currentMessages]);

	const loadConversation = async () => {
		try {
			const response = await chatApi.getConversation(userId!);
			setMessages(response.data);
		} catch (error) {
			console.error('Erro ao carregar conversa:', error);
		} finally {
			setLoading(false);
		}
	};

	const setupSocket = () => {
		const socket = socketService.connectChat();

		socket.on('newMessage', (msg: any) => {
			if (msg.sender.id === userId) {
				addMessage({ ...msg, isMine: false });
			}
		});

		socket.on('userTyping', (data: { userId: string; isTyping: boolean }) => {
			if (data.userId === userId) {
				setTyping(data.userId, data.isTyping);
			}
		});

		socket.on('messageRead', (data: { messageId: string }) => {
			// Atualizar estado da mensagem
		});
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSend = async () => {
		if (!message.trim() && !sending) return;

		setSending(true);
		try {
			const response = await chatApi.sendMessage(userId!, message.trim());
			addMessage({ ...response.data, isMine: true, isRead: false });
			setMessage('');
		} catch (error) {
			console.error('Erro ao enviar mensagem:', error);
		} finally {
			setSending(false);
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setSending(true);
		try {
			const uploadResponse = await uploadApi.uploadImage(file);
			const imageUrl = uploadResponse.data.url;

			const response = await chatApi.sendMessage(userId!, undefined, imageUrl);
			addMessage({ ...response.data, isMine: true, isRead: false });
		} catch (error) {
			console.error('Erro ao enviar imagem:', error);
		} finally {
			setSending(false);
		}
	};

	const handleTyping = () => {
		const socket = socketService.getChatSocket();
		socket?.emit('typing', { receiverId: userId, isTyping: true });

		setTimeout(() => {
			socket?.emit('typing', { receiverId: userId, isTyping: false });
		}, 3000);
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString('pt-BR', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const isTyping = typingUsers.has(userId || '');

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			{/* Header */}
			<AppBar position="static" color="default" elevation={1}>
				<Toolbar>
					<IconButton edge="start" onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>

					<Avatar
						src={otherUser?.photoUrl}
						sx={{ width: 40, height: 40, mx: 1 }}
					>
						{otherUser?.name?.charAt(0).toUpperCase()}
					</Avatar>

					<Box sx={{ flex: 1 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							{otherUser?.name || 'Usuário'}
						</Typography>
						{otherUser?.distance && (
							<Typography variant="caption" color="text.secondary">
								{otherUser.distance}m de distância
							</Typography>
						)}
					</Box>

					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</Toolbar>
			</AppBar>

			{/* Mensagens */}
			<Box
				sx={{
					flex: 1,
					overflow: 'auto',
					p: 2,
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
				}}
			>
				{loading ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				) : currentMessages.length === 0 ? (
					<Box sx={{ textAlign: 'center', color: 'text.secondary', p: 4 }}>
						<Typography>Nenhuma mensagem ainda</Typography>
						<Typography variant="body2">Envie a primeira mensagem!</Typography>
					</Box>
				) : (
					currentMessages.map((msg) => (
						<Box
							key={msg.id}
							sx={{
								display: 'flex',
								justifyContent: msg.isMine ? 'flex-end' : 'flex-start',
							}}
						>
							<Paper
								sx={{
									maxWidth: '75%',
									p: 1.5,
									bgcolor: msg.isMine ? 'primary.main' : 'background.paper',
									borderRadius: 2,
									borderTopRightRadius: msg.isMine ? 0 : 2,
									borderTopLeftRadius: msg.isMine ? 2 : 0,
								}}
							>
								{msg.imageUrl && (
									<Box
										component="img"
										src={msg.imageUrl}
										sx={{
											maxWidth: '100%',
											borderRadius: 1,
											mb: msg.content ? 1 : 0,
										}}
									/>
								)}
								{msg.content && (
									<Typography variant="body2">{msg.content}</Typography>
								)}
								<Typography
									variant="caption"
									sx={{
										display: 'block',
										textAlign: 'right',
										opacity: 0.7,
										mt: 0.5,
									}}
								>
									{formatTime(msg.createdAt)}
								</Typography>
							</Paper>
						</Box>
					))
				)}

				{isTyping && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography variant="caption" color="text.secondary">
							Digitando...
						</Typography>
					</Box>
				)}

				<div ref={messagesEndRef} />
			</Box>

			{/* Input */}
			<Paper
				sx={{
					p: 2,
					borderTop: 1,
					borderColor: 'divider',
				}}
			>
				<TextField
					fullWidth
					placeholder="Digite uma mensagem..."
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
						handleTyping();
					}}
					onKeyPress={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<IconButton
									size="small"
									onClick={() => fileInputRef.current?.click()}
								>
									<ImageIcon />
								</IconButton>
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									color="primary"
									onClick={handleSend}
									disabled={!message.trim() || sending}
								>
									{sending ? <CircularProgress size={24} /> : <SendIcon />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleImageUpload}
				/>
			</Paper>
		</Box>
	);
}
