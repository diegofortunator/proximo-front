import { useEffect, useCallback, useRef } from 'react';
import { useLocationStore } from '../stores/locationStore';
import { socketService } from '../services/socket';
import { useAuthStore } from '../stores/authStore';

const LOCATION_UPDATE_INTERVAL = 5000; // 5 segundos

export function useLocationTracking() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setLocation, setNearbyUsers, startTracking, stopTracking, setError, isTracking } = useLocationStore();
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateLocation = useCallback((position: GeolocationPosition) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined,
    };

    setLocation(location);

    // Enviar para o servidor via WebSocket
    const socket = socketService.getLocationSocket();
    if (socket?.connected) {
      socket.emit('updateLocation', location);
    }
  }, [setLocation]);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let message = 'Erro ao obter localização';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = 'Permissão de localização negada. Por favor, habilite nas configurações do navegador.';
        break;
      case error.POSITION_UNAVAILABLE:
        message = 'Localização indisponível. Verifique se o GPS está habilitado.';
        break;
      case error.TIMEOUT:
        message = 'Tempo esgotado ao obter localização.';
        break;
    }
    setError(message);
  }, [setError]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Conectar ao socket de localização
    const socket = socketService.connectLocation();

    // Ouvir atualizações de usuários próximos
    socket.on('nearbyUsers', (users) => {
      setNearbyUsers(users);
    });

    socket.on('reencounters', (reencounters) => {
      // TODO: Mostrar notificação de reencontro
      console.log('Reencontros:', reencounters);
    });

    socket.on('userNearby', (data) => {
      // Alguém novo está por perto
      console.log('Usuário por perto:', data);
    });

    // Verificar se geolocalização está disponível
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    // Obter localização inicial
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position);
        startTracking();
      },
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Observar mudanças de localização
    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Atualizar localização periodicamente
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        updateLocation,
        () => {}, // Ignorar erros no intervalo
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }, LOCATION_UPDATE_INTERVAL);

    return () => {
      // Limpar ao desmontar
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      socketService.disconnectLocation();
      stopTracking();
    };
  }, [isAuthenticated, setNearbyUsers, updateLocation, handleError, startTracking, stopTracking, setError]);

  return { isTracking };
}
