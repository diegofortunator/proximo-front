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
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

export default function Login() {
	const navigate = useNavigate();
	const { login, isLoading } = useAuthStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			await login(email, password);
			navigate('/');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Erro ao fazer login');
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
						Conecte-se com quem está por perto
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
						Entrar
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

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
						sx={{ mb: 3 }}
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

					<Button
						type="submit"
						fullWidth
						variant="contained"
						size="large"
						disabled={isLoading}
						sx={{ mb: 2 }}
					>
						{isLoading ? <CircularProgress size={24} /> : 'Entrar'}
					</Button>

					<Typography variant="body2" color="text.secondary" textAlign="center">
						Não tem uma conta?{' '}
						<Link component={RouterLink} to="/register" color="primary">
							Cadastre-se
						</Link>
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}
