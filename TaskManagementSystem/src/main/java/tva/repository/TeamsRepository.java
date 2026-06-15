package tva.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tva.models.Teams;

@Repository
public interface TeamsRepository extends JpaRepository<Teams, Long> {

    Teams findByTeamName(String teamName);
}
