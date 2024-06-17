export const getTrueRoles = (userRoles: any[]): string[] => {
    const trueRoles = userRoles
      .filter((role) => Object.values(role)[0] === true)
      .map((role) => Object.keys(role)[0]);
  
    return trueRoles;
  };
  