import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Card,
	CardContent,
	Avatar,
	Typography,
	Button,
	Chip,
	IconButton,
	CircularProgress,
	Skeleton,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Chat as ChatIcon,
	Block as BlockIcon,
	Favorite as FavoriteIcon,
	Work as WorkIcon,
	Cake as CakeIcon,
	LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { profileApi, blocksApi, chatApi, getMediaUrl } from '../services/api';

const maritalStatusLabels: Record<string, string> = {
	SINGLE: 'Solteiro(a)',
	MARRIED: 'Casado(a)',
	DIVORCED: 'Divorciado(a)',
	WIDOWED: 'Viúvo(a)',
	IN_RELATIONSHIP: 'Em um relacionamento',
	COMPLICATED: 'É complicado',
};

interface UserProfile {
	id: string;
	name: string;
	bio?: string;
	photoUrl?: string;
	age?: number;
	profession?: string;
	maritalStatus?: string;
	distance?: number;
	bearing?: number;
}

export default function UserProfile() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [blocking, setBlocking] = useState(false);
	const [startingChat, setStartingChat] = useState(false);

	useEffect(() => {
		const fetchProfile = async () => {
			if (!userId) return;

			try {
				const response = await profileApi.getProfile(userId);
				setProfile(response.data);
			} catch (error: any) {
				console.error('Erro ao carregar perfil:', error);
				if (error.response?.status === 403) {
					// Token de proximidade expirado
					navigate('/');
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [userId, navigate]);

	const handleStartChat = async () => {
		if (!userId) return;

		setStartingChat(true);
		try {
			const response = await chatApi.startConversation(userId);
			navigate(`/chat/${response.data.id}`);
		} catch (error) {
			console.error('Erro ao iniciar conversa:', error);
		} finally {
			setStartingChat(false);
		}
	};

	const handleBlock = async () => {
		if (!userId) return;

		if (!confirm('Tem certeza que deseja bloquear este usuário?')) return;

		setBlocking(true);
		try {
			await blocksApi.blockUser(userId);
			navigate('/');
		} catch (error) {
			console.error('Erro ao bloquear usuário:', error);
		} finally {
			setBlocking(false);
		}
	};

	const getDirectionLabel = (bearing?: number) => {
		if (bearing === undefined) return '';

		if (bearing >= 337.5 || bearing < 22.5) return 'ao Norte';
		if (bearing >= 22.5 && bearing < 67.5) return 'ao Nordeste';
		if (bearing >= 67.5 && bearing < 112.5) return 'ao Leste';
		if (bearing >= 112.5 && bearing < 157.5) return 'ao Sudeste';
		if (bearing >= 157.5 && bearing < 202.5) return 'ao Sul';
		if (bearing >= 202.5 && bearing < 247.5) return 'ao Sudoeste';
		if (bearing >= 247.5 && bearing < 292.5) return 'ao Oeste';
		if (bearing >= 292.5 && bearing < 337.5) return 'ao Noroeste';
		return '';
	};

	if (loading) {
		return (
			<Box sx={{ pb: 2 }}>
				<Box
					sx={{
						background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
						pt: 2,
						pb: 8,
						px: 2,
					}}
				>
					<Container maxWidth="sm">
						<IconButton sx={{ color: 'white' }} onClick={() => navigate(-1)}>
							<ArrowBackIcon />
						</IconButton>
					</Container>
				</Box>
				<Container maxWidth="sm" sx={{ mt: -6 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center', pt: 0 }}>
							<Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mt: -5 }} />
							<Skeleton variant="text" width={150} sx={{ mx: 'auto', mt: 2 }} />
							<Skeleton variant="text" width={200} sx={{ mx: 'auto' }} />
							<Skeleton variant="rectangular" height={100} sx={{ mt: 2, borderRadius: 1 }} />
						</CardContent>
					</Card>
				</Container>
			</Box>
		);
	}

	if (!profile) {
		return (
			<Box sx={{ pb: 2 }}>
				<Box
					sx={{
						background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
						pt: 2,
						pb: 2,
						px: 2,
					}}
				>
					<Container maxWidth="sm">
						<IconButton sx={{ color: 'white' }} onClick={() => navigate(-1)}>
							<ArrowBackIcon />
						</IconButton>
					</Container>
				</Box>
				<Container maxWidth="sm" sx={{ mt: 3 }}>
					<Card>
						<CardContent sx={{ textAlign: 'center', py: 4 }}>
							<Typography variant="h6" color="text.secondary">
								Perfil não encontrado
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
								Este usuário pode ter saído do seu raio de proximidade
							</Typography>
							<Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/')}>
								Voltar ao início
							</Button>
						</CardContent>
					</Card>
				</Container>
			</Box>
		);
	}

	return (
		<Box sx={{ pb: 2 }}>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
					pt: 2,
					pb: 8,
					px: 2,
				}}
			>
				<Container maxWidth="sm">
					<IconButton sx={{ color: 'white' }} onClick={() => navigate(-1)}>
						<ArrowBackIcon />
					</IconButton>
				</Container>
			</Box>

			<Container maxWidth="sm" sx={{ mt: -6 }}>
				{/* Card do perfil */}
				<Card sx={{ mb: 2 }}>
					<CardContent sx={{ textAlign: 'center', pt: 0 }}>
						{/* Avatar */}
						<Avatar
							src={getMediaUrl(profile.photoUrl)}
							sx={{
								width: 100,
								height: 100,
								mx: 'auto',
								mt: -5,
								border: '4px solid',
								borderColor: 'background.paper',
								fontSize: '2.5rem',
							}}
						>
							{profile.name?.charAt(0).toUpperCase()}
						</Avatar>

						{/* Nome */}
						<Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
							{profile.name}
						</Typography>

						{/* Distância */}
						{profile.distance !== undefined && (
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 0.5,
									color: 'primary.main',
									mt: 0.5,
								}}
							>
								<LocationOnIcon fontSize="small" />
								<Typography variant="body2" fontWeight={500}>
									{Math.round(profile.distance)}m {getDirectionLabel(profile.bearing)}
								</Typography>
							</Box>
						)}

						{/* Bio */}
						{profile.bio && (
							<Typography variant="body2" sx={{ mt: 2 }}>
								{profile.bio}
							</Typography>
						)}

						{/* Chips de informações */}
						<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
							{profile.age && (
								<Chip
									icon={<CakeIcon />}
									label={`${profile.age} anos`}
									variant="outlined"
								/>
							)}
							{profile.profession && (
								<Chip
									icon={<WorkIcon />}
									label={profile.profession}
									variant="outlined"
								/>
							)}
							{profile.maritalStatus && profile.maritalStatus !== 'NOT_INFORMED' && (
								<Chip
									icon={<FavoriteIcon />}
									label={maritalStatusLabels[profile.maritalStatus]}
									variant="outlined"
									color={profile.maritalStatus === 'SINGLE' ? 'success' : 'default'}
								/>
							)}
						</Box>

						{/* Botões de ação */}
						<Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
							<Button
								variant="contained"
								startIcon={startingChat ? <CircularProgress size={20} color="inherit" /> : <ChatIcon />}
								onClick={handleStartChat}
								disabled={startingChat}
							>
								Iniciar conversa
							</Button>
							<Button
								variant="outlined"
								color="error"
								startIcon={blocking ? <CircularProgress size={20} color="inherit" /> : <BlockIcon />}
								onClick={handleBlock}
								disabled={blocking}
							>
								Bloquear
							</Button>
						</Box>
					</CardContent>
				</Card>

				{/* Aviso */}
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ textAlign: 'center', px: 2 }}
				>
					As mensagens com este usuário só existirão enquanto vocês estiverem
					a menos de 50 metros de distância.
				</Typography>
			</Container>
		</Box>
	);
}
