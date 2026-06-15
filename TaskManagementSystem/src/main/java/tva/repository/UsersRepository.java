package tva.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tva.models.Users;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
	@Query("select U.id from Users U where U.email=:email")
	public Object checkByEmail(@Param("email") String email);

	@Query("select U.role from Users U where U.email=:email and U.password=:password")
	public Object validateCredentials(@Param("email") String email, @Param("password") String password);
	
	@Query("select U from Users U where U.email=:email")
	  public Object findByEmail(@Param("email") String email);
	
	@Query("select M from Menus M join Rolesmapping R on M.mid=R.mid where R.role=:role")
	public java.util.List<Object> getMenus(@Param("role") Long role);
	
	@Query("select U,R from Users U left join Roles R on U.role=R.role where U.email=:email")
	  public Object profileByEmail(@Param("email") String email);
	
	@Query("select U from Users U where U.role=:role")
	public java.util.List<Users> getUsersByRole(@Param("role") int role);

	@Query("select U from Users U where U.team.teamId=:teamId")
	public java.util.List<Users> findByTeamId(@Param("teamId") Long teamId);
}
  
