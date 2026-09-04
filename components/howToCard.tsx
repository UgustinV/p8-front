export const HowToCard = ({ title, description }: { title: string; description: string }) => {
    return (
        <div className="bg-(--dark-orange) rounded-[10px] px-5.5 py-11 h-50 gap-4 max-w-67.5">
            <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
            <p className="text-white text-[12px]">{description}</p>
        </div>
    );
}