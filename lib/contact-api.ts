export type ContactRequestPayload = {
  fullName: string;
  phoneNumber: string;
  serviceType: string;
  description: string;
};

export type ContactRequestResponse = {
  ok: boolean;
  message: string;
};
