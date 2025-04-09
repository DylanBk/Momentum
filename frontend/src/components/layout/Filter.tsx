type FilterProps = {
    name: string | null
};

export default function Filter(props: FilterProps) {
    return (
        <div className="w-fit p-2 rounded-lg bg-filterActive text-secondaryText">
            <p>{props.name}</p>
        </div>
    );
};