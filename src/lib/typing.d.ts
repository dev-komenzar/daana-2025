export type Director = {
	/** 所属・肩書き（例: "東京大学東洋文化研究所・准教授"） */
	affiliation: string;
	bio: string;
	imageUrl?: string;
	name: string;
	/** 氏名（ローマ字） */
	nameRomaji: string;
	position: string;
};

export type Staff = {
	name: string;
	/** 氏名（ローマ字） */
	nameRomaji: string;
	position: string;
};
