import {
	Card,
	CardContent,
	Avatar,
	Typography,
	Box,
	Chip,
	IconButton,
} from '@mui/material';
import {
	Chat as ChatIcon,
	Navigation as NavigationIcon,
	Favorite as FavoriteIcon,
	Work as WorkIcon,
} from '@mui/icons-material';
import { NearbyUser } from '../stores/locationStore';
import { getMediaUrl } from '../services/api';

interface NearbyUserCardProps {
	user: NearbyUser;
	onClick: () => void;
	onChatClick: () => void;
}

const maritalStatusLabels: Record<string, string> = {
	SINGLE: 'Solteiro(a)',
	MARRIED: 'Casado(a)',
	DIVORCED: 'Divorciado(a)',
	WIDOWED: 'Viúvo(a)',
	IN_RELATIONSHIP: 'Em um relacionamento',
	COMPLICATED: 'É complicado',
	NOT_INFORMED: '',
};

export default function NearbyUserCard({ user, onClick, onChatClick }: NearbyUserCardProps) {
	const getDirectionArrow = (bearing: number) => {
		// Converte bearing em emoji de seta
		const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
		const index = Math.round(bearing / 45) % 8;
		return arrows[index];
	};

	return (
		<Card
			sx={{
				cursor: 'pointer',
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					transform: 'translateY(-2px)',
					boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
				},
			}}
			onClick={onClick}
		>
			<CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
				{/* Avatar */}
				<Avatar
					src={getMediaUrl(user.photoUrl)}
					sx={{
						width: 64,
						height: 64,
						bgcolor: 'primary.main',
						fontSize: '1.5rem',
					}}
				>
					{user.name.charAt(0).toUpperCase()}
				</Avatar>

				{/* Info */}
				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
						{user.name}
						{user.age && (
							<Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
								{user.age} anos
							</Typography>
						)}
					</Typography>

					{/* Tags */}
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
						{user.maritalStatus && maritalStatusLabels[user.maritalStatus] && (
							<Chip
								size="small"
								icon={<FavoriteIcon sx={{ fontSize: 14 }} />}
								label={maritalStatusLabels[user.maritalStatus]}
								sx={{ height: 24, fontSize: '0.75rem' }}
							/>
						)}
						{user.profession && (
							<Chip
								size="small"
								icon={<WorkIcon sx={{ fontSize: 14 }} />}
								label={user.profession}
								sx={{ height: 24, fontSize: '0.75rem' }}
							/>
						)}
					</Box>

					{/* Distância e direção */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
						<Chip
							size="small"
							icon={<NavigationIcon sx={{ fontSize: 14 }} />}
							label={`${user.distance}m ${getDirectionArrow(user.bearing)}`}
							color="primary"
							variant="outlined"
							sx={{ height: 24, fontSize: '0.75rem' }}
						/>
					</Box>
				</Box>

				{/* Botão de chat */}
				<IconButton
					color="primary"
					onClick={(e) => {
						e.stopPropagation();
						onChatClick();
					}}
					sx={{
						bgcolor: 'primary.main',
						color: 'white',
						'&:hover': {
							bgcolor: 'primary.dark',
						},
					}}
				>
					<ChatIcon />
				</IconButton>
			</CardContent>
		</Card>
	);
}
