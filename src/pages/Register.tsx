import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Link,
	Alert,
	CircularProgress,
	InputAdornment,
	IconButton,
} from '@mui/material';
import {
	Visibility,
	VisibilityOff,
	Email,
	Lock,
	Person,
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

export default function Register() {
	const navigate = useNavigate();
	const { register, isLoading } = useAuthStore();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('As senhas não coincidem');
			return;
		}

		if (password.length < 6) {
			setError('A senha deve ter no mínimo 6 caracteres');
			return;
		}

		try {
			await register(email, password, name);
			navigate('/');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Erro ao criar conta');
		}
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				bgcolor: 'background.default',
				py: 4,
			}}
		>
			<Container maxWidth="xs">
				{/* Logo e título */}
				<Box sx={{ textAlign: 'center', mb: 4 }}>
					<Typography
						variant="h3"
						sx={{
							fontWeight: 700,
							background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
							backgroundClip: 'text',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							mb: 1,
						}}
					>
						Proximo
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Crie sua conta e comece a se conectar
					</Typography>
				</Box>

				{/* Formulário */}
				<Box
					component="form"
					onSubmit={handleSubmit}
					sx={{
						bgcolor: 'background.paper',
						p: 4,
						borderRadius: 3,
						boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
					}}
				>
					<Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
						Criar conta
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<TextField
						fullWidth
						label="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						sx={{ mb: 2 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Person color="action" />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						sx={{ mb: 2 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Email color="action" />
								</InputAdornment>
							),
						}}
					/>

					<TextField
						fullWidth
						label="Senha"
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						sx={{ mb: 2 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock color="action" />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>

					<TextField
						fullWidth
						label="Confirmar senha"
						type={showPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						sx={{ mb: 3 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Lock color="action" />
								</InputAdornment>
							),
						}}
					/>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={isLoading}
						sx={{ mb: 2 }}
					>
						{isLoading ? <CircularProgress size={24} /> : 'Criar conta'}
					</Button>

					<Typography variant="body2" color="text.secondary" textAlign="center">
						Já tem uma conta?{' '}
						<Link component={RouterLink} to="/login" color="primary">
							Entrar
						</Link>
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
