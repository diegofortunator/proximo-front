import { useState } from 'react';
import {
	Box,
	Paper,
	Typography,
	TextField,
	Button,
	Collapse,
	IconButton,
} from '@mui/material';
import {
	BugReport as BugReportIcon,
	Close as CloseIcon,
	MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import { useLocationStore } from '../stores/locationStore';
import { socketService } from '../services/socket';

// Coordenadas padrão dos usuários de teste (Florianópolis)
const DEFAULT_TEST_COORDS = {
	latitude: -27.451194,
	longitude: -48.530417,
};

export default function DebugLocation() {
	const [open, setOpen] = useState(false);
	const [lat, setLat] = useState(DEFAULT_TEST_COORDS.latitude.toString());
	const [lng, setLng] = useState(DEFAULT_TEST_COORDS.longitude.toString());
	const { currentLocation, setLocation } = useLocationStore();

	// Apenas mostrar em desenvolvimento
	if (import.meta.env.PROD) {
		return null;
	}

	const handleUpdateLocation = () => {
		const latitude = parseFloat(lat);
		const longitude = parseFloat(lng);

		if (isNaN(latitude) || isNaN(longitude)) {
			alert('Coordenadas inválidas');
			return;
		}

		const location = {
			latitude,
			longitude,
			accuracy: 10,
		};

		// Atualizar store local
		setLocation(location);

		// Enviar para o servidor via WebSocket
		const socket = socketService.getLocationSocket();
		if (socket?.connected) {
			socket.emit('updateLocation', location);
			console.log('📍 Localização simulada enviada:', location);
		} else {
			console.warn('⚠️ Socket não conectado');
		}
	};

	const handleUseTestCoords = () => {
		setLat(DEFAULT_TEST_COORDS.latitude.toString());
		setLng(DEFAULT_TEST_COORDS.longitude.toString());
	};

	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 80,
				right: 16,
				zIndex: 1000,
			}}
		>
			<Collapse in={open}>
				<Paper
					elevation={6}
					sx={{
						p: 2,
						mb: 1,
						width: 280,
						bgcolor: 'grey.900',
					}}
				>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="subtitle2" color="warning.main">
							🐛 Debug: Localização
						</Typography>
						<IconButton size="small" onClick={() => setOpen(false)}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Box>

					{currentLocation && (
						<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
							Atual: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
						</Typography>
					)}

					<TextField
						fullWidth
						size="small"
						label="Latitude"
						value={lat}
						onChange={(e) => setLat(e.target.value)}
						sx={{ mb: 1 }}
					/>
					<TextField
						fullWidth
						size="small"
						label="Longitude"
						value={lng}
						onChange={(e) => setLng(e.target.value)}
						sx={{ mb: 2 }}
					/>

					<Box sx={{ display: 'flex', gap: 1 }}>
						<Button
							size="small"
							variant="outlined"
							onClick={handleUseTestCoords}
							sx={{ flex: 1 }}
						>
							Coords Teste
						</Button>
						<Button
							size="small"
							variant="contained"
							onClick={handleUpdateLocation}
							startIcon={<MyLocationIcon />}
							sx={{ flex: 1 }}
						>
							Enviar
						</Button>
					</Box>
				</Paper>
			</Collapse>

			<IconButton
				onClick={() => setOpen(!open)}
				sx={{
					bgcolor: 'warning.dark',
					color: 'white',
					'&:hover': { bgcolor: 'warning.main' },
					float: 'right',
				}}
			>
				<BugReportIcon />
			</IconButton>
		</Box>
	);
}
