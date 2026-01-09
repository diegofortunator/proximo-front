import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
	Box,
	BottomNavigation,
	BottomNavigationAction,
	Paper,
	Badge,
} from '@mui/material';
import {
	Explore as ExploreIcon,
	Chat as ChatIcon,
	Group as GroupIcon,
	Person as PersonIcon,
} from '@mui/icons-material';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useChatStore } from '../stores/chatStore';

export default function Layout() {
	const navigate = useNavigate();
	const location = useLocation();
	const conversations = useChatStore((state) => state.conversations);

	// Iniciar rastreamento de localização
	useLocationTracking();

	const getNavValue = () => {
		if (location.pathname === '/') return 0;
		if (location.pathname.startsWith('/chat')) return 1;
		if (location.pathname.startsWith('/group')) return 2;
		if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/settings')) return 3;
		return 0;
	};

	const [value, setValue] = useState(getNavValue());

	useEffect(() => {
		setValue(getNavValue());
	}, [location.pathname]);

	const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

	const handleNavigation = (_: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		switch (newValue) {
			case 0:
				navigate('/');
				break;
			case 1:
				navigate('/');
				break;
			case 2:
				navigate('/');
				break;
			case 3:
				navigate('/profile');
				break;
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				minHeight: '100vh',
				bgcolor: 'background.default',
			}}
		>
			{/* Conteúdo principal */}
			<Box
				component="main"
				sx={{
					flex: 1,
					overflow: 'auto',
					pb: 8, // Espaço para bottom navigation
				}}
			>
				<Outlet />
			</Box>

			{/* Bottom Navigation */}
			<Paper
				sx={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
					zIndex: 1000,
				}}
				elevation={3}
			>
				<BottomNavigation value={value} onChange={handleNavigation}>
					<BottomNavigationAction
						label="Explorar"
						icon={<ExploreIcon />}
					/>
					<BottomNavigationAction
						label="Chats"
						icon={
							<Badge badgeContent={unreadCount} color="secondary">
								<ChatIcon />
							</Badge>
						}
					/>
					<BottomNavigationAction
						label="Grupos"
						icon={<GroupIcon />}
					/>
					<BottomNavigationAction
						label="Perfil"
						icon={<PersonIcon />}
					/>
				</BottomNavigation>
			</Paper>
		</Box>
	);
}
