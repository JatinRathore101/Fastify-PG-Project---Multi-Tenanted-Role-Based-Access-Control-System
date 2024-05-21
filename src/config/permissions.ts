export const ALL_PERMISSIONS =[
      // USERS
      'users:roles:write', // allowed to add a role to a user
      'users:roles:delete', // allowed to remove a role from a user
  
      // POSTS
      'posts:write',
      'posts:read',
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc,permission)=>{
    acc[permission]=permission;
    return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number],(typeof ALL_PERMISSIONS)[number]>)