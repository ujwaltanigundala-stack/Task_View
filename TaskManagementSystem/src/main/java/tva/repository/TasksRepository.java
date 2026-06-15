package tva.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import tva.models.Tasks;
import tva.models.Users;


@Repository
public interface TasksRepository extends JpaRepository<Tasks, Long> {

    @Query("select U from Users U where U.role=1 and U.status=1")
    public List<Users> getUsers();

    public List<Tasks> findByUserEmail(String email);

    @Query("select T from Tasks T where T.user.team.teamId=:teamId")
    public List<Tasks> findByTeamId(@Param("teamId") Long teamId);

    @Query("select T from Tasks T where T.user.team.teamId=:teamId and T.status=:status")
    public List<Tasks> findByTeamIdAndStatus(@Param("teamId") Long teamId, @Param("status") int status);

    @Query("""
            select T from Tasks T
            where lower(T.title) like lower(concat('%', :query, '%'))
               or lower(T.description) like lower(concat('%', :query, '%'))
               or lower(T.user.fullname) like lower(concat('%', :query, '%'))
               or lower(T.user.email) like lower(concat('%', :query, '%'))
               or lower(T.user.team.teamName) like lower(concat('%', :query, '%'))
            """)
    public List<Tasks> searchTasks(@Param("query") String query);
} 
