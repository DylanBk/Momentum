type AccountSecurityProps = {
    onEdit: (type: string) => void
};

export default function AccountSecurity(props: AccountSecurityProps) {
    return (
        <div className="py-8 border-b border-divider text-primaryText">
            <h2 className="text-2xl">Account Security</h2>

            <div className="w-96 flex flex-col gap-4 mt-8">
                <div className="flex flex-row items-center justify-between">
                    <p>Password</p>
                    <button
                        className="settings-btn"
                        onClick={() => props.onEdit('password')}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};