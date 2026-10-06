# Active Hemisphere Video Playback in 3D Orbit

We decided to play video loops in the 3D Orbit Universe only when cards occupy the foreground active hemisphere ($Z \ge 0$), pausing playback when cards rotate behind the central text overlay ($Z < 0$). This eliminates GPU/battery thrashing across 14 simultaneous video decoders and guarantees steady 60fps rotational drag performance on mobile and battery-powered devices.
