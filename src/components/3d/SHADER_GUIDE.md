/**
 * Shader Gradient Implementation Guide
 * 
 * ShaderGradient Component: Dynamic, animated gradient backgrounds using WebGL shaders
 * Location: src/components/3d/ShaderGradient.tsx
 * 
 * Features:
 * - Smooth, flowing animations with three animated color centers
 * - Respects accessibility (works with prefers-reduced-motion via parent component)
 * - Optimized WebGL rendering with medium precision
 * - Easy color customization via props
 * - Dynamic intensity control
 * 
 * Usage Examples:
 * 
 * 1. Basic Usage in Hero Sections:
 *    <ShaderGradientCanvas 
 *      className="w-full h-full"
 *      color1="#FAF7F4"  // Primary color (cream)
 *      color2="#F5EDE6"  // Secondary color (beige)
 *      color3="#B76E79"  // Tertiary color (rose-gold)
 *      intensity={0.6}   // Animation speed multiplier (0.0-1.0)
 *    />
 * 
 * 2. Colors from Zeyar Brand Palette:
 *    - Cream: #FAF7F4
 *    - Beige: #F5EDE6
 *    - Nude: #E6B7A9
 *    - Rose Gold: #B76E79
 *    - Brown: #3A2E2A
 * 
 * 3. Recommended Intensity Values:
 *    - Hero Sections: 0.6-0.8 (noticeable animation)
 *    - Secondary Sections: 0.4-0.5 (subtle background animation)
 *    - Newsletter/CTA: 0.4-0.6 (balanced)
 * 
 * 4. Recommended Opacity for Section Background:
 *    - Hero (primary focus): 60% opacity
 *    - Featured/Collections: 35% opacity
 *    - Newsletter: 40% opacity
 * 
 * Implementation Details:
 * 
 * Vertex Shader:
 * - Simple pass-through shader
 * - Maps UV coordinates from the plane geometry
 * 
 * Fragment Shader:
 * - Creates multiple animated radial gradients
 * - Combines multiple wave frequencies for organic motion
 * - Uses smoothstep for soft falloff between colors
 * - Adds subtle shimmer texture for visual depth
 * 
 * Animation Parameters:
 * - Three color centers that move independently
 * - Multiple sine/cosine waves with different frequencies
 * - Smooth easing via smoothstep function
 * 
 * Performance Optimization:
 * - Uses mediump precision for mobile compatibility
 * - Device pixel ratio set to 1-1.5x for balance
 * - Alpha transparency enabled
 * - Dynamic imports with SSR disabled (no server-side rendering)
 * 
 * Browser Compatibility:
 * - Works on all modern browsers with WebGL 2 support
 * - Gracefully degrades on older browsers (shows nothing via SSR fallback)
 * 
 * Integrated Sections:
 * 1. HeroSection.tsx - Main hero with 3D dress model
 * 2. ShopHeroMotion.tsx - Shop page hero section
 * 3. FeaturedCollections.tsx - Featured products carousel
 * 4. Newsletter.tsx - Newsletter subscription section
 * 
 * Future Enhancement Ideas:
 * - Mouse interaction shaders
 * - Scroll-based shader animation
 * - Preset shader effects (glitch, liquid, aurora, etc.)
 * - Interactive shader builder UI
 * - Particle system integration
 */

/* Shader Gradient Container Styles */
.shader-gradient-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shader-gradient-canvas {
  width: 100%;
  height: 100%;
}

/* Ensure relative positioning for shader backgrounds */
.shader-gradient-section {
  position: relative;
  overflow: hidden;
}

.shader-gradient-overlay {
  position: absolute;
  inset: 0;
}
