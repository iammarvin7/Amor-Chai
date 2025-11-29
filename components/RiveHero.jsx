'use client';
import { RiveComponent } from '@rive-app/react-canvas';

const RiveHero = ({ src, className }) => {
	return <RiveComponent src={src} autoplay className={className} />;
};

export default RiveHero;




