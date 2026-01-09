import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Card,
	CardContent,
	Typography,
	Switch,
	IconButton,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListItemSecondaryAction,
	Alert,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	Visibility as VisibilityIcon,
	Cake as CakeIcon,
	Work as WorkIcon,
	Favorite as FavoriteIcon,
	Notifications as NotificationsIcon,
	NotificationsOff as NotificationsOffIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { profileApi } from '../services/api';

export default function Settings() {
	const navigate = useNavigate();
	const { user, updateUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);

	const [settings, setSettings] = useState({
		isVisible: user?.settings?.isVisible ?? true,
		showAge: user?.settings?.showAge ?? true,
		showProfession: user?.settings?.showProfession ?? true,
		showMaritalStatus: user?.settings?.showMaritalStatus ?? true,
		notifyOnMessage: user?.settings?.notifyOnMessage ?? true,
	});

	const handleToggle = async (setting: string) => {
		setLoading(true);
		try {
			const newValue = !settings[setting as keyof typeof settings];

			const response = await profileApi.updateSettings({
				[setting]: newValue,
			});

			setSettings((prev) => ({ ...prev, [setting]: newValue }));
			updateUser({
				settings: { ...user?.settings, ...response.data } as any,
			});

			setSuccess('Configuração atualizada!');
			setTimeout(() => setSuccess(null), 2000);
		} catch (error) {
			console.error('Erro ao atualizar configuração:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ pb: 2 }}>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
					pt: 2,
					pb: 2,
					px: 2,
				}}
			>
				<Container maxWidth="sm">
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<IconButton sx={{ color: 'white' }} onClick={() => navigate(-1)}>
							<ArrowBackIcon />
						</IconButton>
						<Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
							Configurações
						</Typography>
					</Box>
				</Container>
			</Box>

			<Container maxWidth="sm" sx={{ mt: 3 }}>
				{success && (
					<Alert severity="success" sx={{ mb: 2 }}>
						{success}
					</Alert>
				)}

				{/* Privacidade */}
				<Card sx={{ mb: 2 }}>
					<CardContent sx={{ pb: 1 }}>
						<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
							PRIVACIDADE
						</Typography>
					</CardContent>
					<List disablePadding>
						<ListItem>
							<ListItemIcon>
								<VisibilityIcon />
							</ListItemIcon>
							<ListItemText
								primary="Visibilidade"
								secondary="Aparecer para pessoas próximas"
							/>
							<ListItemSecondaryAction>
								<Switch
									edge="end"
									checked={settings.isVisible}
									onChange={() => handleToggle('isVisible')}
									disabled={loading}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<Divider variant="inset" component="li" />
						<ListItem>
							<ListItemIcon>
								<CakeIcon />
							</ListItemIcon>
							<ListItemText
								primary="Mostrar idade"
								secondary="Exibir sua idade no perfil"
							/>
							<ListItemSecondaryAction>
								<Switch
									edge="end"
									checked={settings.showAge}
									onChange={() => handleToggle('showAge')}
									disabled={loading}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<Divider variant="inset" component="li" />
						<ListItem>
							<ListItemIcon>
								<WorkIcon />
							</ListItemIcon>
							<ListItemText
								primary="Mostrar profissão"
								secondary="Exibir sua profissão no perfil"
							/>
							<ListItemSecondaryAction>
								<Switch
									edge="end"
									checked={settings.showProfession}
									onChange={() => handleToggle('showProfession')}
									disabled={loading}
								/>
							</ListItemSecondaryAction>
						</ListItem>
						<Divider variant="inset" component="li" />
						<ListItem>
							<ListItemIcon>
								<FavoriteIcon />
							</ListItemIcon>
							<ListItemText
								primary="Mostrar estado civil"
								secondary="Exibir seu estado civil no perfil"
							/>
							<ListItemSecondaryAction>
								<Switch
									edge="end"
									checked={settings.showMaritalStatus}
									onChange={() => handleToggle('showMaritalStatus')}
									disabled={loading}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</Card>

				{/* Notificações */}
				<Card>
					<CardContent sx={{ pb: 1 }}>
						<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
							NOTIFICAÇÕES
						</Typography>
					</CardContent>
					<List disablePadding>
						<ListItem>
							<ListItemIcon>
								{settings.notifyOnMessage ? (
									<NotificationsIcon />
								) : (
									<NotificationsOffIcon />
								)}
							</ListItemIcon>
							<ListItemText
								primary="Notificações"
								secondary="Receber notificações de reencontros e mensagens"
							/>
							<ListItemSecondaryAction>
								<Switch
									edge="end"
									checked={settings.notifyOnMessage}
									onChange={() => handleToggle('notifyOnMessage')}
									disabled={loading}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					</List>
				</Card>

				{/* Info */}
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mt: 3, textAlign: 'center', px: 2 }}
				>
					Quando você está invisível, ninguém pode te ver no radar ou nas proximidades.
					Suas conversas existentes continuam funcionando.
				</Typography>
			</Container>
		</Box>
	);
}
