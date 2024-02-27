export type NavLinksProps = {
	Icon: RorwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref">>;
}

export type UserProps = {
	uid: string;
	displayName: string;
	email: string;
	photoURL: string;
	photoNumber?: string | null;
	providerID?: string;
}