export type Testimonial = {
  id: number;
  name: string;
  designation: string;
  content: string;
  image: string;
  star: number;
};

export type SocilaProofNotification = {
  id: number;
  message: string;
  firstName: string | null;
  lastName: string | null;
  user: string | null;
  plan: string | null;
  avatrUrl: string | null;
  location: string | null;

};
