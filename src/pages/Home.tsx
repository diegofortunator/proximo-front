import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Container,
	Typography,
	Card,
	Chip,
	Alert,
	Tabs,
	Tab,
	CircularProgress,
} from '@mui/material';
import {
	Navigation as NavigationIcon,
	Chat as ChatIcon,
	Groups as GroupsIcon,
	LocationOff as LocationOffIcon,
} from '@mui/icons-material';
import { useLocationStore, NearbyUser } from '../stores/locationStore';
import NearbyUserCard from '../components/NearbyUserCard';
import RadarView from '../components/RadarView';
import ConversationsList from '../components/ConversationsList';
import GroupsList from '../components/GroupsList';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			{value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
		</div>
	);
}

export default function Home() {
	const navigate = useNavigate();
	const { nearbyUsers, isTracking, error } = useLocationStore();
	const [activeTab, setActiveTab] = useState(0);
	const [viewMode, setViewMode] = useState<'list' | 'radar'>('radar');

	const handleUserClick = (user: NearbyUser) => {
		navigate(`/user/${user.userId}`);
	};

	const handleChatClick = (userId: string) => {
		navigate(`/chat/${userId}`);
	};

	if (!isTracking && !error) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minHeight: '80vh',
					p: 3,
				}}
			>
				<CircularProgress size={48} sx={{ mb: 2 }} />
				<Typography variant="body1" color="text.secondary">
					Obtendo sua localização...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ pb: 2 }}>
			{/* Header */}
			<Box
				sx={{
					background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
					pt: 4,
					pb: 3,
					px: 2,
					borderBottomLeftRadius: 24,
					borderBottomRightRadius: 24,
				}}
			>
				<Container maxWidth="sm">
					<Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
						Proximo
					</Typography>
					<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
						{nearbyUsers.length} pessoa{nearbyUsers.length !== 1 ? 's' : ''} por perto
					</Typography>
				</Container>
			</Box>

			<Container maxWidth="sm" sx={{ mt: -2 }}>
				{/* Erro de localização */}
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{/* Tabs */}
				<Card sx={{ mb: 2 }}>
					<Tabs
						value={activeTab}
						onChange={(_, v) => setActiveTab(v)}
						variant="fullWidth"
						sx={{
							'& .MuiTab-root': {
								minHeight: 56,
							},
						}}
					>
						<Tab icon={<NavigationIcon />} label="Por perto" />
						<Tab icon={<ChatIcon />} label="Conversas" />
						<Tab icon={<GroupsIcon />} label="Grupos" />
					</Tabs>
				</Card>

				{/* Tab: Por perto */}
				<TabPanel value={activeTab} index={0}>
					{nearbyUsers.length === 0 ? (
						<Card sx={{ p: 4, textAlign: 'center' }}>
							<LocationOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
							<Typography variant="h6" gutterBottom>
								Ninguém por perto
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Não encontramos ninguém em um raio de 50 metros.
								Tente novamente em outro local!
							</Typography>
						</Card>
					) : (
						<>
							{/* Toggle entre lista e radar */}
							<Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
								<Chip
									label="Lista"
									onClick={() => setViewMode('list')}
									color={viewMode === 'list' ? 'primary' : 'default'}
									sx={{ mr: 1 }}
								/>
								<Chip
									label="Radar"
									onClick={() => setViewMode('radar')}
									color={viewMode === 'radar' ? 'primary' : 'default'}
								/>
							</Box>

							{viewMode === 'radar' ? (
								<RadarView
									users={nearbyUsers}
									onUserClick={handleUserClick}
								/>
							) : (
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
									{nearbyUsers.map((user) => (
										<NearbyUserCard
											key={user.userId}
											user={user}
											onClick={() => handleUserClick(user)}
											onChatClick={() => handleChatClick(user.userId)}
										/>
									))}
								</Box>
							)}
						</>
					)}
				</TabPanel>

				{/* Tab: Conversas */}
				<TabPanel value={activeTab} index={1}>
					<ConversationsList />
				</TabPanel>

				{/* Tab: Grupos */}
				<TabPanel value={activeTab} index={2}>
					<GroupsList />
				</TabPanel>
			</Container>
		</Box>
	);
}
