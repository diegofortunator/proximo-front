import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Card,
	CardActionArea,
	Typography,
	Chip,
	Button,
	CircularProgress,
} from '@mui/material';
import {
	Groups as GroupsIcon,
	Add as AddIcon,
	People as PeopleIcon,
} from '@mui/icons-material';
import { useGroupStore, Group } from '../stores/groupStore';
import { groupsApi } from '../services/api';

export default function GroupsList() {
	const navigate = useNavigate();
	const { nearbyGroups, setNearbyGroups } = useGroupStore();
	const [loading, setLoading] = useState(false);
	const [joining, setJoining] = useState(false);

	useEffect(() => {
		loadGroups();
	}, []);

	const loadGroups = async () => {
		setLoading(true);
		try {
			const response = await groupsApi.getNearbyGroups();
			setNearbyGroups(response.data);
		} catch (error) {
			console.error('Erro ao carregar grupos:', error);
		} finally {
			setLoading(false);
		}
	};

	const joinProximityGroup = async () => {
		setJoining(true);
		try {
			const response = await groupsApi.joinProximityGroup();
			navigate(`/group/${response.data.id}`);
		} catch (error) {
			console.error('Erro ao entrar no grupo:', error);
		} finally {
			setJoining(false);
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{/* Botão para criar/entrar no chat local */}
			<Card
				sx={{
					background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
					color: 'white',
				}}
			>
				<CardActionArea
					onClick={joinProximityGroup}
					disabled={joining}
					sx={{ p: 3, textAlign: 'center' }}
				>
					{joining ? (
						<CircularProgress size={24} sx={{ color: 'white' }} />
					) : (
						<>
							<AddIcon sx={{ fontSize: 40, mb: 1 }} />
							<Typography variant="h6" sx={{ fontWeight: 600 }}>
								Entrar no Chat Local
							</Typography>
							<Typography variant="body2" sx={{ opacity: 0.8 }}>
								Converse com todas as pessoas próximas
							</Typography>
						</>
					)}
				</CardActionArea>
			</Card>

			{/* Lista de grupos */}
			{nearbyGroups.length === 0 ? (
				<Card sx={{ p: 4, textAlign: 'center' }}>
					<GroupsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
					<Typography variant="h6" gutterBottom>
						Nenhum grupo por perto
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Crie um chat local para conversar com pessoas próximas!
					</Typography>
				</Card>
			) : (
				nearbyGroups.map((group) => (
					<Card key={group.id}>
						<CardActionArea
							onClick={() => navigate(`/group/${group.id}`)}
							sx={{ p: 2 }}
						>
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box
									sx={{
										width: 50,
										height: 50,
										borderRadius: 2,
										bgcolor: 'primary.main',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<GroupsIcon sx={{ color: 'white' }} />
								</Box>

								<Box sx={{ flex: 1 }}>
									<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
										{group.name}
									</Typography>
									{group.description && (
										<Typography variant="body2" color="text.secondary" noWrap>
											{group.description}
										</Typography>
									)}
								</Box>

								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
									<Chip
										size="small"
										icon={<PeopleIcon sx={{ fontSize: 14 }} />}
										label={group.memberCount}
										sx={{ height: 24 }}
									/>
									{group.distance !== undefined && (
										<Typography variant="caption" color="text.secondary">
											{group.distance}m
										</Typography>
									)}
								</Box>
							</Box>
						</CardActionArea>
					</Card>
				))
			)}
		</Box>
	);
}
