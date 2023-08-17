let groupathyMessagesId = 0;
const GROUPATHY_USER_ID = 1;
const GROUPATHY_USER_NAME = 'Groupathy';
let userMessagesId = 1000;
const USER_ID = 10;
const USER_NAME = 'User';

export const createGroupathyMessages = (message: string, index: number) => {
  return [
    {
      _id: ++index,
      text: message,
      createdAt: new Date(),
      user: {
        _id: GROUPATHY_USER_ID,
        name: GROUPATHY_USER_NAME,
        avatar: require('../../assets/avatar_groupathy.png'),
      },
    },
  ];
};

export const createUserResponseMessages = (message: string) => {
  return [
    {
      _id: ++userMessagesId,
      text: message,
      createdAt: new Date(),
      user: {
        _id: USER_ID,
        name: USER_NAME,
      },
    },
  ];
};
