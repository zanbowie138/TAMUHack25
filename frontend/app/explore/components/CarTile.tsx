import getImage from '@/utils/get_image';
import { Car } from '@/config/Car';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@mui/joy';

interface CarOption {
    model: string;
    price: number;
    features: string[];
    mpg: string;
    year: number;
    engineType: string;
}





export default function CarTile(car: CarOption){
    const animations = {
        container: {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        },
        item: {
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
        },
        filter: {
            active: { backgroundColor: "#D1B8E1", scale: 1.02, transition: { type: "spring", stiffness: 300 } },
            inactive: { backgroundColor: "#374151", scale: 1 }
        }
    };

    const formatPrice = (price: number) => `$${price.toLocaleString()}`;

    return (
        <motion.div 
        key={car.model}
        variants={animations.item}
        layout
        whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
        className="bg-gray-700 rounded-lg overflow-hidden shadow-lg"
        >
        <motion.div className="h-48 bg-gray-600 relative" whileHover={{ scale: 1.05 }}>
            <div className="absolute top-4 left-4">
                <CircularProgress
                determinate
                value={75}
                sx={{ "--CircularProgress-trackThickness": "3px", "--CircularProgress-progressThickness": "3px", "--CircularProgress-progressColor": "#D1B8E1" }}
                >
                    <div className="text-lg font-medium text-white">75</div>
                </CircularProgress>
            </div>
            <Image
            src={getImage(new Car(car.model.toLowerCase(), car.year.toString()))}
            alt={`${car.model} Image`}
            fill
            className="object-contain"
            />
            <motion.div className="absolute top-2 right-2 bg-[#D1B8E1] text-black px-2 py-1 rounded text-sm">
            {car.year}
            </motion.div>
        </motion.div>
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-2">{car.year} Toyota {car.model.charAt(0).toUpperCase() + car.model.slice(1)}</h3>
            <p className="text-[#98FB98] text-lg mb-3">{formatPrice(car.price)}</p>
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-300">
            <span>MPG: {car.mpg}</span>
            <span>{car.engineType}</span>
            </div>
            <ul className="text-sm text-gray-300">
            {car.features.map((feature, index) => (
                <motion.li key={index} className="mb-1">• {feature}</motion.li>
            ))}
            </ul>
            <div className="mt-4 flex gap-2">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-white to-[#D1B8E1] text-gray-800 py-2 px-4 rounded hover:opacity-90"
            >
                Learn More
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05, background: "linear-gradient(to right, white, #D1B8E1)", color: "rgb(31, 41, 55)" }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 border border-[#D1B8E1] text-[#D1B8E1] py-2 px-4 rounded"
            >
                Compare
            </motion.button>
            </div>
        </div>
        </motion.div>
    );
}
