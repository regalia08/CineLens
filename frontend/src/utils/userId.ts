export function getUserId(): string {
  
  let userID = localStorage.getItem('UserID');
  
  if(userID == null){
	  userID = crypto.randomUUID();
	  localStorage.setItem('UserID', userID);
  }

  return userID;
}
