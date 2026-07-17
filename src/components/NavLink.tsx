type NavLinkProps = {
    label: string;
    isActive: boolean;
    className: string;
    onClick: () => void;
};

function NavLink({ label, isActive, className, onClick }: NavLinkProps) {
    return (
        <button
            className={`${className} ${isActive ? 'active' : ''}`}
            type="button"
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
        >
            {label}
        </button>
    );
}

export default NavLink;
