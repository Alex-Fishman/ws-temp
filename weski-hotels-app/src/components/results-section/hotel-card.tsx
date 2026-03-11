import { Hotel } from '../../api/hotels';
import LocationIcon from './location-icon';
import MountainIcon from './mountain-icon';
import Stars from './stars';

const SKELETON_KEYS = [0, 1, 2] as const;

export const skeletonCards = SKELETON_KEYS.map(i => (
    <div key={i} className="hotel-card hotel-card--skeleton">
        <div className="hotel-card__image" />
        <div className="hotel-card__body">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--stars" />
            <div className="skeleton-line skeleton-line--location" />
        </div>
    </div>
));

export default function HotelCard({ hotel, resortName }: { hotel: Hotel; resortName: string }) {
    const mainImage = hotel.images?.find((img) => img.isMain) ?? hotel.images?.[0];
    return (
        <div className="hotel-card">
            <div
                className="hotel-card__image"
                style={mainImage ? { backgroundImage: `url(${mainImage.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
                {!mainImage && <MountainIcon />}
            </div>
            <div className="hotel-card__body">
                <div className="hotel-card__info">
                    <h2 className="hotel-card__name">{hotel.name}</h2>
                    <Stars count={hotel.rating} />
                    <p className="hotel-card__location">
                        <LocationIcon />
                        {resortName}
                    </p>
                </div>
                <div className="hotel-card__footer">
                    <div className="hotel-card__price">
                        <span className="hotel-card__price-amount">€{hotel.pricePerNight.toLocaleString()}</span>
                        <span className="hotel-card__price-label">/per person</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
