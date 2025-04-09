type AccountDangerZoneProps = {
    onLogout: () => void,
    onDelete: () => void
};

export default function AccountDangerZone(props: AccountDangerZoneProps) {

    return (
        <div className="py-8 border-b border-divider text-primaryText">
            <h2 className="text-2xl text-danger">Danger Zone</h2>

            <div className="flex flex-col gap-4 mt-8">
                <button
                    className="w-fit btn-danger1"
                    onClick={() => props.onLogout()}>
                    Logout
                </button>

                <button
                    className="w-fit btn-danger2"
                    onClick={() => props.onDelete()}>
                    Delete Account
                </button>
            </div>

        </div>
    );
};