package tva.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import tva.models.Assignments;
import tva.models.Users;

public interface AssignmentsRepository extends JpaRepository<Assignments, Integer> {

    List<Assignments> findByUser(Users user);

    List<Assignments> findByStatus(int status);

}