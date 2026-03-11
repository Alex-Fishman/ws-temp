export default function Stars({ count }: { count: number }) {
    return (
        <div className="hotel-stars">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < count ? 'star star--filled' : 'star'}>★</span>
            ))}
        </div>
    );
}
