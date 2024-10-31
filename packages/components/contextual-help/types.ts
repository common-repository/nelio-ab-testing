export type Question = {
	readonly link: string;
	readonly label: string;
};

export type TutorialStep = {
	readonly intro: string;
	readonly title: string;
	readonly active?: () => boolean;
	readonly element?: () => HTMLElement | null;
};

export type State = {
	readonly mode: 'contact-form' | 'questions';
	readonly email: string;
	readonly description: string;
	readonly isTicketSubmitting: boolean;
	readonly submissionStatus: 'none' | 'error' | 'success';
};

export type Submission = {
	readonly email: string;
	readonly description: string;
	readonly success: () => void;
	readonly error: () => void;
};
