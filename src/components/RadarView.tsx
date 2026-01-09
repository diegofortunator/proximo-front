import { Box, Avatar, Typography, Tooltip } from '@mui/material';
import { NearbyUser } from '../stores/locationStore';

interface RadarViewProps {
	users: NearbyUser[];
	onUserClick: (user: NearbyUser) => void;
}

const RADAR_SIZE = 300;
const MAX_RADIUS = 50; // 50 metros

export default function RadarView({ users, onUserClick }: RadarViewProps) {
	// Converte a posição do usuário baseado na distância e bearing
	const getUserPosition = (user: NearbyUser) => {
		const radius = (user.distance / MAX_RADIUS) * (RADAR_SIZE / 2 - 30);
		const angle = (user.bearing - 90) * (Math.PI / 180); // -90 para alinhar norte com topo

		const x = RADAR_SIZE / 2 + radius * Math.cos(angle);
		const y = RADAR_SIZE / 2 + radius * Math.sin(angle);

		return { x, y };
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: RADAR_SIZE,
				height: RADAR_SIZE,
				margin: '0 auto',
				borderRadius: '50%',
				background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
				border: '2px solid rgba(99, 102, 241, 0.3)',
			}}
		>
			{/* Círculos de distância */}
			{[1, 2, 3].map((ring) => (
				<Box
					key={ring}
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: (RADAR_SIZE / 3) * ring,
						height: (RADAR_SIZE / 3) * ring,
						borderRadius: '50%',
						border: '1px dashed rgba(99, 102, 241, 0.2)',
					}}
				/>
			))}

			{/* Linhas de direção */}
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: 0,
					right: 0,
					height: 1,
					bgcolor: 'rgba(99, 102, 241, 0.2)',
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					left: '50%',
					top: 0,
					bottom: 0,
					width: 1,
					bgcolor: 'rgba(99, 102, 241, 0.2)',
				}}
			/>

			{/* Indicador de Norte */}
			<Typography
				sx={{
					position: 'absolute',
					top: 8,
					left: '50%',
					transform: 'translateX(-50%)',
					fontSize: '0.75rem',
					color: 'primary.main',
					fontWeight: 600,
				}}
			>
				N
			</Typography>

			{/* Centro (você) */}
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 16,
					height: 16,
					borderRadius: '50%',
					bgcolor: 'primary.main',
					boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
					zIndex: 10,
				}}
			/>

			{/* Usuários */}
			{users.map((user) => {
				const pos = getUserPosition(user);

				return (
					<Tooltip
						key={user.userId}
						title={
							<Box>
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{user.name}
								</Typography>
								<Typography variant="caption">
									{user.distance}m de distância
								</Typography>
							</Box>
						}
						arrow
					>
						<Avatar
							src={user.photoUrl || undefined}
							onClick={() => onUserClick(user)}
							sx={{
								position: 'absolute',
								left: pos.x - 20,
								top: pos.y - 20,
								width: 40,
								height: 40,
								cursor: 'pointer',
								border: '2px solid',
								borderColor: 'secondary.main',
								boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
								transition: 'transform 0.2s',
								'&:hover': {
									transform: 'scale(1.2)',
									zIndex: 20,
								},
							}}
						>
							{user.name.charAt(0).toUpperCase()}
						</Avatar>
					</Tooltip>
				);
			})}

			{/* Legenda de distância */}
			<Box
				sx={{
					position: 'absolute',
					bottom: -30,
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					gap: 2,
					fontSize: '0.7rem',
					color: 'text.secondary',
				}}
			>
				<span>0m</span>
				<span>~17m</span>
				<span>~33m</span>
				<span>50m</span>
			</Box>
		</Box>
	);
}
