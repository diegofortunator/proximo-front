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
	Drawer,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Divider,
	Badge,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Send as SendIcon,
	Image as ImageIcon,
	People as PeopleIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import { useGroupStore, GroupMessage } from '../stores/groupStore';
import { groupsApi, uploadApi, getMediaUrl } from '../services/api';
import { socketService } from '../services/socket';

export default function GroupChat() {
	const { groupId } = useParams<{ groupId: string }>();
	const navigate = useNavigate();
	const {
		currentGroup,
		currentMessages,
		setCurrentGroup,
		setMessages,
		addMessage,
		addMember,
		removeMember,
		typingUsers,
		setTyping,
	} = useGroupStore();

	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (groupId) {
			loadGroup();
			loadMessages();
			setupSocket();
		}

		return () => {
			const socket = socketService.getGroupsSocket();
			socket?.off('newGroupMessage');
			socket?.off('memberJoined');
			socket?.off('memberLeft');
			socket?.off('userTyping');
		};
	}, [groupId]);

	useEffect(() => {
		scrollToBottom();
	}, [currentMessages]);

	const loadGroup = async () => {
		try {
			const response = await groupsApi.getGroup(groupId!);
			setCurrentGroup(response.data);
		} catch (error) {
			console.error('Erro ao carregar grupo:', error);
		}
	};

	const loadMessages = async () => {
		try {
			const response = await groupsApi.getMessages(groupId!);
			setMessages(response.data);
		} catch (error) {
			console.error('Erro ao carregar mensagens:', error);
		} finally {
			setLoading(false);
		}
	};

	const setupSocket = () => {
		const socket = socketService.connectGroups();

		// Entrar no grupo via socket
		socket.emit('joinGroup', { groupId });

		socket.on('newGroupMessage', (data: { groupId: string; message: GroupMessage }) => {
			if (data.groupId === groupId) {
				addMessage({ ...data.message, isMine: false });
			}
		});

		socket.on('memberJoined', (data: any) => {
			if (data.groupId === groupId) {
				addMember(data.member);
			}
		});

		socket.on('memberLeft', (data: { groupId: string; userId: string }) => {
			if (data.groupId === groupId) {
				removeMember(data.userId);
			}
		});

		socket.on('userTyping', (data: { groupId: string; userId: string; isTyping: boolean }) => {
			if (data.groupId === groupId) {
				setTyping(data.userId, data.isTyping);
			}
		});
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const handleSend = async () => {
		if (!message.trim() || sending) return;

		setSending(true);
		try {
			const response = await groupsApi.sendMessage(groupId!, message.trim());
			addMessage({ ...response.data, isMine: true });
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

			const response = await groupsApi.sendMessage(groupId!, undefined, imageUrl);
			addMessage({ ...response.data, isMine: true });
		} catch (error) {
			console.error('Erro ao enviar imagem:', error);
		} finally {
			setSending(false);
		}
	};

	const handleTyping = () => {
		const socket = socketService.getGroupsSocket();
		socket?.emit('typing', { groupId, isTyping: true });

		setTimeout(() => {
			socket?.emit('typing', { groupId, isTyping: false });
		}, 3000);
	};

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString('pt-BR', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const typingCount = typingUsers.size;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
			{/* Header */}
			<AppBar position="static" color="default" elevation={1}>
				<Toolbar>
					<IconButton edge="start" onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>

					<Box sx={{ flex: 1, ml: 1 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							{currentGroup?.name || 'Chat Local'}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{currentGroup?.memberCount || 0} participantes
						</Typography>
					</Box>

					<IconButton onClick={() => setDrawerOpen(true)}>
						<Badge badgeContent={currentGroup?.memberCount} color="primary">
							<PeopleIcon />
						</Badge>
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
						<Typography variant="body2">Seja o primeiro a enviar uma mensagem!</Typography>
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
							{!msg.isMine && (
								<Avatar
									src={getMediaUrl(msg.sender.photoUrl)}
									sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
								>
									{msg.sender.name?.charAt(0).toUpperCase() || '?'}
								</Avatar>
							)}

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
								{!msg.isMine && (
									<Typography
										variant="caption"
										sx={{
											fontWeight: 600,
											color: msg.sender.id ? 'secondary.main' : 'text.disabled',
											display: 'block',
											mb: 0.5,
										}}
									>
										{msg.sender.name || 'Usuário desconhecido'}
									</Typography>
								)}

								{msg.imageUrl && (
									<Box
										component="img"
										src={getMediaUrl(msg.imageUrl)}
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

				{typingCount > 0 && (
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography variant="caption" color="text.secondary">
							{typingCount} pessoa{typingCount > 1 ? 's' : ''} digitando...
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

			{/* Drawer de membros */}
			<Drawer
				anchor="right"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
			>
				<Box sx={{ width: 280 }}>
					<Box
						sx={{
							p: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography variant="h6">Participantes</Typography>
						<IconButton onClick={() => setDrawerOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Divider />
					<List>
						{currentGroup?.members.map((member) => (
							<ListItem key={member.userId}>
								<ListItemAvatar>
									<Avatar src={getMediaUrl(member.photoUrl)}>
										{member.name?.charAt(0).toUpperCase()}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={member.name}
									secondary={`Entrou ${new Date(member.joinedAt).toLocaleDateString('pt-BR')}`}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</Box>
	);
}
