// project-imports

import mockData, { range } from 'utils/mock-data';

const newPerson = (index) => {
  const tempData = mockData(index);
  const statusCode = tempData.number.status(0, 2);
  let status;
  switch (statusCode) {
    case 2:
      status = 'Complicated';
      break;
    case 1:
      status = 'Relationship';
      break;
    case 0:
    default:
      status = 'Single';
      break;
  }

  const orderStatusCode = tempData.number.status(0, 7);
  let orderStatus;
  switch (orderStatusCode) {
    case 7:
      orderStatus = 'Refunded';
      break;
    case 6:
      orderStatus = 'Completed';
      break;
    case 5:
      orderStatus = 'Delivered';
      break;
    case 4:
      orderStatus = 'Dispatched';
      break;
    case 3:
      orderStatus = 'Cancelled';
      break;
    case 2:
      orderStatus = 'Shipped';
      break;
    case 1:
      orderStatus = 'Processing';
      break;
    case 0:
    default:
      orderStatus = 'Pending';
      break;
  }

  const firstName = tempData.name.first;
  const lastName = tempData.name.last;

  return {
    id: index,
    firstName,
    lastName,
    fullName: firstName + ' ' + lastName,
    email: tempData.email,
    age: tempData.number.age,
    role: tempData.role,
    visits: tempData.number.amount,
    progress: tempData.number.percentage,
    status,
    orderStatus,
    contact: tempData.contact,
    country: tempData.address.country,
    address: tempData.address.full,
    fatherName: tempData.name.full,
    about: tempData.text.sentence,
    avatar: tempData.number.status(1, 10),
    skills: tempData.skill,
    time: tempData.time
  };
};

export default function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d, index) => ({
      ...newPerson(index + 1),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
    }));
  };

  return makeDataLevel();
}
