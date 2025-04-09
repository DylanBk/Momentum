type AccountInfoProps = {
    userData: {
        id: number | null,
        email: string | null,
        username: string | null
    },
    onEdit: (type: string) => void
};

export default function AccountInfo(props: AccountInfoProps) {
    return (
        <div className="pb-8 border-b border-divider text-primaryText">
            <h2 className="text-2xl">Account Information</h2>

            <div className="w-96 flex flex-col gap-4 mt-8">
                <div className="flex flex-row items-center justify-between">
                    <p>Username:
                        <span className="text-secondaryText"> {props.userData.username}</span>
                    </p>
                    <button
                        className="settings-btn"
                        onClick={() => props.onEdit('username')}>
                        Edit
                    </button>
                </div>

                <div className="flex flex-row items-center justify-between">
                    <p>Email:
                        <span className="text-secondaryText"> {props.userData.email}</span>
                    </p>
                    <button
                        className="settings-btn"
                        onClick={() => props.onEdit('email')}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};