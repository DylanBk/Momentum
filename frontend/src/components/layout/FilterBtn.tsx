import { useEffect, useRef } from "react";

type FilterBtnProps = {
    name: string,
    value: string | number | string[] | undefined,
    content: string,
    function: (e: React.MouseEvent<HTMLButtonElement>) => void,
    group: {
        id: number,
        options: {
            content: string,
            function: (id: number) => void
        }[]
    } | null,
    isOpen: boolean,
    setOpenMenu: (menu: string | null) => void
};

export default function FilterBtn(props: FilterBtnProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                props.setOpenMenu(null);
            };
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [props]);

    const handleOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        props.setOpenMenu(props.isOpen ? null : (`${props.name}-${props.value}`));
    };

    useEffect(() => {
        if (menuRef.current) {
            menuRef.current.parentElement?.scrollIntoView({behavior: 'smooth'})
        };
    }, [props.isOpen]);

    return (
        <div className="relative w-full">
            <button
                name={props.name}
                className="w-full flex flex-row items-center justify-between p-2 rounded-lg bg-filter hover:bg-filterActive focus:bg-filterActive active:bg-filterActive text-sm text-placeholderText hover:text-primaryText transition-colors duration-200"
                value={props.value}
                onClick={props.function}>
                {props.content}
            </button>

            { props.group && (
                <>
                    <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-transparent hover:bg-filterActive focus:bg-filterActive active:bg-filterActive"
                        onClick={handleOptions}
                        aria-label="More options">
                        <svg className="h-5 fill-placeholderText" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                        </svg>
                    </button>

                    { props.isOpen && (
                        <div
                            ref={menuRef}
                            className="w-32 absolute top-full right-0 z-10 flex flex-col border border-divider rounded-md bg-bg overflow-hidden">
                            {props.group.options.map((option, i) => (
                                <button
                                    key={i}
                                    className="border-b border-divider last:border-none rounded-none text-secondaryText hover:bg-filterActive hover:text-primaryText"
                                    onClick={() => {
                                        option.function(props.group!.id)
                                    }}>
                                    {option.content}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};