import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Card,
	CardContent,
	TextField,
	Button,
	Avatar,
	IconButton,
	Typography,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	CircularProgress,
	Alert,
} from '@mui/material';
import {
	ArrowBack as ArrowBackIcon,
	PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useAuthStore } from '../stores/authStore';
import { profileApi, uploadApi, getMediaUrl } from '../services/api';

const maritalStatusOptions = [
	{ value: 'NOT_INFORMED', label: 'Não informar' },
	{ value: 'SINGLE', label: 'Solteiro(a)' },
	{ value: 'MARRIED', label: 'Casado(a)' },
	{ value: 'DIVORCED', label: 'Divorciado(a)' },
	{ value: 'WIDOWED', label: 'Viúvo(a)' },
	{ value: 'IN_RELATIONSHIP', label: 'Em um relacionamento' },
	{ value: 'COMPLICATED', label: 'É complicado' },
];

export default function EditProfile() {
	const navigate = useNavigate();
	const { user, updateUser } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const [formData, setFormData] = useState({
		name: user?.profile?.name || '',
		bio: user?.profile?.bio || '',
		birthDate: user?.profile?.birthDate ? new Date(user.profile.birthDate) : null,
		profession: user?.profile?.profession || '',
		maritalStatus: user?.profile?.maritalStatus || 'NOT_INFORMED',
		photoUrl: user?.profile?.photoUrl || '',
	});

	const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const response = await uploadApi.uploadImage(file);
			setFormData((prev) => ({ ...prev, photoUrl: response.data.url }));
		} catch (error) {
			console.error('Erro ao fazer upload:', error);
			setError('Erro ao fazer upload da foto');
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError(null);

		try {
			const dataToSend = {
				name: formData.name,
				bio: formData.bio || null,
				birthDate: formData.birthDate?.toISOString() || null,
				profession: formData.profession || null,
				maritalStatus: formData.maritalStatus,
				photoUrl: formData.photoUrl || null,
			};

			const response = await profileApi.updateMyProfile(dataToSend);

			updateUser({
				profile: response.data,
			});

			setSuccess(true);
			setTimeout(() => {
				navigate('/profile');
			}, 1500);
		} catch (error: any) {
			console.error('Erro ao atualizar perfil:', error);
			setError(error.response?.data?.message || 'Erro ao atualizar perfil');
		} finally {
			setLoading(false);
		}
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
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
								Editar Perfil
							</Typography>
						</Box>
					</Container>
				</Box>

				<Container maxWidth="sm" sx={{ mt: 3 }}>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					{success && (
						<Alert severity="success" sx={{ mb: 2 }}>
							Perfil atualizado com sucesso!
						</Alert>
					)}

					<Card>
						<CardContent>
							{/* Foto */}
							<Box sx={{ textAlign: 'center', mb: 3 }}>
								<Box sx={{ position: 'relative', display: 'inline-block' }}>
									<Avatar
										src={getMediaUrl(formData.photoUrl)}
										sx={{
											width: 100,
											height: 100,
											fontSize: '2.5rem',
										}}
									>
										{formData.name?.charAt(0).toUpperCase()}
									</Avatar>
									<input
										accept="image/*"
										id="photo-upload"
										type="file"
										hidden
										onChange={handlePhotoUpload}
									/>
									<label htmlFor="photo-upload">
										<IconButton
											component="span"
											disabled={uploading}
											sx={{
												position: 'absolute',
												bottom: 0,
												right: 0,
												bgcolor: 'primary.main',
												color: 'white',
												'&:hover': { bgcolor: 'primary.dark' },
											}}
										>
											{uploading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<PhotoCameraIcon fontSize="small" />
											)}
										</IconButton>
									</label>
								</Box>
							</Box>

							{/* Nome */}
							<TextField
								fullWidth
								label="Nome"
								value={formData.name}
								onChange={handleChange('name')}
								sx={{ mb: 2 }}
								required
							/>

							{/* Bio */}
							<TextField
								fullWidth
								label="Bio"
								multiline
								rows={3}
								value={formData.bio}
								onChange={handleChange('bio')}
								placeholder="Conte um pouco sobre você..."
								sx={{ mb: 2 }}
							/>

							{/* Data de nascimento */}
							<DatePicker
								label="Data de nascimento"
								value={formData.birthDate}
								onChange={(date) => setFormData((prev) => ({ ...prev, birthDate: date }))}
								slotProps={{
									textField: {
										fullWidth: true,
										sx: { mb: 2 },
									},
								}}
								maxDate={new Date()}
							/>

							{/* Profissão */}
							<TextField
								fullWidth
								label="Profissão"
								value={formData.profession}
								onChange={handleChange('profession')}
								sx={{ mb: 2 }}
							/>

							{/* Estado civil */}
							<FormControl fullWidth sx={{ mb: 3 }}>
								<InputLabel>Estado civil</InputLabel>
								<Select
									value={formData.maritalStatus}
									label="Estado civil"
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, maritalStatus: e.target.value }))
									}
								>
									{maritalStatusOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{/* Botão salvar */}
							<Button
								fullWidth
								variant="contained"
								size="large"
								onClick={handleSubmit}
								disabled={loading || !formData.name}
							>
								{loading ? <CircularProgress size={24} color="inherit" /> : 'Salvar alterações'}
							</Button>
						</CardContent>
					</Card>
				</Container>
			</Box>
		</LocalizationProvider>
	);
}
