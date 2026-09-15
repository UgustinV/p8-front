export const Tag = ({ label }: { label: string }) => {
    return (
        <span className="py-2 bg-(--light-grey) text-(--dark-grey) text-center text-[12px] w-full rounded-[5px]">{label}</span>
    );
};