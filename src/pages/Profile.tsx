import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
	Switch,
} from '@mui/material';
import {
	Edit as EditIcon,
	Settings as SettingsIcon,
	Logout as LogoutIcon,
	Visibility as VisibilityIcon,
	VisibilityOff as VisibilityOffIcon,
	Favorite as FavoriteIcon,
	Work as WorkIcon,
	Cake as CakeIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { profileApi, getMediaUrl } from '../services/api';

const maritalStatusLabels: Record<string, string> = {
	SINGLE: 'Solteiro(a)',
	MARRIED: 'Casado(a)',
	DIVORCED: 'Divorciado(a)',
	WIDOWED: 'Viúvo(a)',
	IN_RELATIONSHIP: 'Em um relacionamento',
	COMPLICATED: 'É complicado',
	NOT_INFORMED: 'Não informado',
};

export default function Profile() {
	const navigate = useNavigate();
	const { user, logout, updateUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [isVisible, setIsVisible] = useState(user?.settings?.isVisible ?? true);

	const handleToggleVisibility = async () => {
		setLoading(true);
		try {
			const response = await profileApi.toggleVisibility();
			setIsVisible(response.data.isVisible);
			updateUser({
				settings: { ...user?.settings, isVisible: response.data.isVisible } as any,
			});
		} catch (error) {
			console.error('Erro ao alterar visibilidade:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const calculateAge = (birthDate: string) => {
		const today = new Date();
		const birth = new Date(birthDate);
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<Box sx={{ pb: 2 }}>
			{/* Header - barra fina no topo */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
					py: 1,
					px: 2,
				}}
			>
				<Container maxWidth="sm">
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
						<IconButton
							sx={{ color: 'white' }}
							onClick={() => navigate('/settings')}
							size="small"
						>
							<SettingsIcon fontSize="small" />
						</IconButton>
					</Box>
				</Container>
			</Box>

			<Container maxWidth="sm" sx={{ mt: 2 }}>
				{/* Card do perfil */}
				<Card sx={{ mb: 2 }}>
					<CardContent sx={{ textAlign: 'center', pt: 3 }}>
						{/* Avatar */}
						<Avatar
							src={getMediaUrl(user?.profile?.photoUrl)}
							sx={{
								width: 100,
								height: 100,
								mx: 'auto',
								border: '4px solid',
								borderColor: 'primary.main',
								fontSize: '2.5rem',
							}}
						>
							{user?.profile?.name?.charAt(0).toUpperCase()}
						</Avatar>

						{/* Nome */}
						<Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
							{user?.profile?.name}
						</Typography>

						{/* Email */}
						<Typography variant="body2" color="text.secondary">
							{user?.email}
						</Typography>

						{/* Bio */}
						{user?.profile?.bio && (
							<Typography variant="body2" sx={{ mt: 2 }}>
								{user.profile.bio}
							</Typography>
						)}

						{/* Chips de informações */}
						<Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
							{user?.profile?.birthDate && (
								<Chip
									icon={<CakeIcon />}
									label={`${calculateAge(user.profile.birthDate)} anos`}
									variant="outlined"
								/>
							)}
							{user?.profile?.profession && (
								<Chip
									icon={<WorkIcon />}
									label={user.profile.profession}
									variant="outlined"
								/>
							)}
							{user?.profile?.maritalStatus && user.profile.maritalStatus !== 'NOT_INFORMED' && (
								<Chip
									icon={<FavoriteIcon />}
									label={maritalStatusLabels[user.profile.maritalStatus]}
									variant="outlined"
								/>
							)}
						</Box>

						{/* Botão editar */}
						<Button
							variant="contained"
							startIcon={<EditIcon />}
							onClick={() => navigate('/profile/edit')}
							sx={{ mt: 3 }}
						>
							Editar Perfil
						</Button>
					</CardContent>
				</Card>

				{/* Visibilidade */}
				<Card sx={{ mb: 2 }}>
					<CardContent>
						<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								{isVisible ? (
									<VisibilityIcon color="primary" />
								) : (
									<VisibilityOffIcon color="disabled" />
								)}
								<Box>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										Visibilidade
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{isVisible
											? 'Você está visível para pessoas próximas'
											: 'Você está invisível'}
									</Typography>
								</Box>
							</Box>
							<Switch
								checked={isVisible}
								onChange={handleToggleVisibility}
								disabled={loading}
							/>
						</Box>
					</CardContent>
				</Card>

				{/* Logout */}
				<Card>
					<CardContent>
						<Button
							fullWidth
							color="error"
							startIcon={<LogoutIcon />}
							onClick={handleLogout}
						>
							Sair da conta
						</Button>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}
