import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import GroupChat from './pages/GroupChat';
import UserProfile from './pages/UserProfile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
	return (
		<Routes>
			{/* Rotas públicas */}
			<Route
				path="/login"
				element={
					<PublicRoute>
						<Login />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<Register />
					</PublicRoute>
				}
			/>

			{/* Rotas privadas */}
			<Route
				path="/"
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				<Route index element={<Home />} />
				<Route path="profile" element={<Profile />} />
				<Route path="profile/edit" element={<EditProfile />} />
				<Route path="settings" element={<Settings />} />
				<Route path="chat/:userId" element={<Chat />} />
				<Route path="group/:groupId" element={<GroupChat />} />
				<Route path="user/:userId" element={<UserProfile />} />
			</Route>
		</Routes>
	);
}

export default App;
