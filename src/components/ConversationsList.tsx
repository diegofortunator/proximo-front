import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Card,
	CardActionArea,
	Avatar,
	Typography,
	Badge,
	Chip,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { useChatStore } from '../stores/chatStore';
import { chatApi, getMediaUrl } from '../services/api';

export default function ConversationsList() {
	const navigate = useNavigate();
	const { conversations, setConversations } = useChatStore();

	useEffect(() => {
		loadConversations();
	}, []);

	const loadConversations = async () => {
		try {
			const response = await chatApi.getConversations();
			setConversations(response.data);
		} catch (error) {
			console.error('Erro ao carregar conversas:', error);
		}
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diff = now.getTime() - date.getTime();

		if (diff < 60000) return 'Agora';
		if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
		if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
		return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
	};

	if (conversations.length === 0) {
		return (
			<Card sx={{ p: 4, textAlign: 'center' }}>
				<ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
				<Typography variant="h6" gutterBottom>
					Nenhuma conversa
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Encontre pessoas próximas e comece a conversar!
				</Typography>
			</Card>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
			{conversations.map((conv) => (
				<Card key={conv.otherUser.id}>
					<CardActionArea
						onClick={() => navigate(`/chat/${conv.otherUser.id}`)}
						sx={{ p: 2 }}
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Badge
								badgeContent={conv.unreadCount}
								color="secondary"
								max={99}
							>
								<Avatar
									src={getMediaUrl(conv.otherUser.photoUrl)}
									sx={{ width: 50, height: 50 }}
								>
									{conv.otherUser.name?.charAt(0).toUpperCase()}
								</Avatar>
							</Badge>

							<Box sx={{ flex: 1, minWidth: 0 }}>
								<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
										{conv.otherUser.name}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{formatTime(conv.lastMessage.createdAt)}
									</Typography>
								</Box>

								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Typography
										variant="body2"
										color="text.secondary"
										noWrap
										sx={{
											flex: 1,
											fontWeight: conv.unreadCount > 0 ? 600 : 400,
										}}
									>
										{conv.lastMessage.isMine && 'Você: '}
										{conv.lastMessage.content || '📷 Foto'}
									</Typography>

									{conv.otherUser.distance && (
										<Chip
											size="small"
											label={`${conv.otherUser.distance}m`}
											sx={{ height: 20, fontSize: '0.7rem' }}
										/>
									)}
								</Box>
							</Box>
						</Box>
					</CardActionArea>
				</Card>
			))}
		</Box>
	);
}
