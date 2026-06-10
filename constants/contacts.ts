export type Contact = {
  id: string;
  initials: string;
  color: string;
  name: string;
  phone: string;
  avatarUri?: string;
};

export const CONTACTS: Contact[] = [
  {
    id: 'ruben-troso',
    initials: 'RT',
    color: '#D6D64A',
    name: 'Rúben Troso',
    phone: '+244 912 345 678',
    avatarUri:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'luis-diogo',
    initials: 'LD',
    color: '#2F78B7',
    name: 'Luís Diogo',
    phone: '+244 912 345 678',
  },
  {
    id: 'naym-mupoia',
    initials: 'NM',
    color: '#2FB7A9',
    name: 'Naym Mupoia',
    phone: '+244 912 345 678',
  },
];

export function getContactById(id: string): Contact | undefined {
  return CONTACTS.find((c) => c.id === id);
}
