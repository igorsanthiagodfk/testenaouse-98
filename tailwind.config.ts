import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				orange: {
					DEFAULT: 'hsl(var(--orange))',
					foreground: 'hsl(var(--orange-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			perspective: {
				'1000': '1000px',
				'2000': '2000px',
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'elegant': 'var(--shadow-elegant)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px hsl(160 100% 50% / 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px hsl(160 100% 50% / 0.6)'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-out-right': {
					'0%': {
						transform: 'translateX(0)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(100%)',
						opacity: '0'
					}
				},
				'notification-appear': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px) scale(0.8)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'progress-fill': {
					'0%': {
						width: '0%'
					},
					'100%': {
						width: '100%'
					}
				},
				'glassmorphism': {
					'0%': {
						backdropFilter: 'blur(0px)',
						background: 'hsl(var(--background) / 0.8)'
					},
					'100%': {
						backdropFilter: 'blur(10px)',
						background: 'hsl(var(--background) / 0.9)'
					}
				},
				'typing': {
					'0%': {
						width: '0ch'
					},
					'100%': {
						width: '30ch'
					}
				},
				'blink': {
					'0%, 50%': {
						opacity: '1'
					},
					'51%, 100%': {
						opacity: '0'
					}
				},
				'infinite-scroll': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-50%)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'word-appear': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px) scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0) scale(1)'
					}
				},
				'card-hover-expand': {
					'0%': {
						transform: 'scale(1) rotateY(0deg)',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
					},
					'100%': {
						transform: 'scale(1.05) rotateY(5deg)',
						boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
					}
				},
				'slide-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'slide-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(50px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'count-up': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.5)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'pulse-accent': {
					'0%, 100%': {
						boxShadow: '0 0 0 0 hsl(var(--accent) / 0.7)'
					},
					'50%': {
						boxShadow: '0 0 0 10px hsl(var(--accent) / 0)'
					}
				},
				'background-shift': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'50%': {
						backgroundPosition: '100% 50%'
					},
					'100%': {
						backgroundPosition: '0% 50%'
					}
				},
				'carousel-slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(100px) scale(0.8)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0) scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-out-right': 'slide-out-right 0.3s ease-out',
				'notification-appear': 'notification-appear 0.5s ease-out',
				'progress-fill': 'progress-fill 1s ease-out',
				'glassmorphism': 'glassmorphism 0.3s ease-out',
				'typing': 'typing 3s steps(30, end) infinite',
				'blink': 'blink 1s infinite',
				'infinite-scroll': 'infinite-scroll 20s linear infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'word-appear': 'word-appear 0.8s ease-out forwards',
				'card-hover-expand': 'card-hover-expand 0.3s ease-out forwards',
				'slide-in-left': 'slide-in-left 0.6s ease-out',
				'slide-in-up': 'slide-in-up 0.6s ease-out',
				'count-up': 'count-up 1s ease-out',
				'pulse-accent': 'pulse-accent 2s infinite',
				'background-shift': 'background-shift 30s ease-in-out infinite',
				'carousel-slide-in': 'carousel-slide-in 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
