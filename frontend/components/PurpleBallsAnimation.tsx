import React, { useEffect, useRef } from 'react';

const PurpleBallsAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Ball properties
        const balls: { x: number; y: number; radius: number; dx: number; dy: number }[] = [];
        const numBalls = 5; // Number of balls

        for (let i = 0; i < numBalls; i++) {
            balls.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 20 + 5, // Random radius between 10 and 30
                dx: (Math.random() - 0.5) * 2, // Random horizontal speed
                dy: (Math.random() - 0.5) * 2  // Random vertical speed
            });
        }

        const drawBall = (ball: { x: number; y: number; radius: number }) => {
            const gradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)'); // Center color (white)
            gradient.addColorStop(.6, '#CFB4DF'); // Edge color (light purple)

            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient; // Use the gradient as the fill style
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 50;
            ctx.shadowColor = '#CFB4DF'; // White shadow with 50% opacity
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            balls.forEach(ball => {
                ball.x += ball.dx;
                ball.y += ball.dy;

                // Bounce off walls
                if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                    ball.dx *= -1; // Reverse direction
                }
                if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                    ball.dy *= -1; // Reverse direction
                }

                drawBall(ball);
            });

            requestAnimationFrame(update); // Loop the animation
        };

        update(); // Start the animation

        // Resize canvas on window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // Optional: to place it behind other content
            }}
        />
    );
};

export default PurpleBallsAnimation;