package tva.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import tva.models.Assignments;
import tva.models.Users;
import tva.services.AssignmentsService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/assignment")
public class AssignmentsController {

    @Autowired
    AssignmentsService AS;

    @PostMapping("/add")
    public Object addAssignment(
            @RequestBody Assignments assignment,
            @RequestHeader("Token") String token)
    {
        return AS.addAssignment(assignment, token);
    }

    @GetMapping("/getall")
    public Object getAllAssignments(
            @RequestHeader("Token") String token)
    {
        return AS.getAllAssignments(token);
    }

    @GetMapping("/get/{assignmentId}")
    public Object getAssignmentById(
            @PathVariable int assignmentId,
            @RequestHeader("Token") String token)
    {
        return AS.getAssignmentById(assignmentId, token);
    }

    @GetMapping("/status/{status}")
    public Object getAssignmentsByStatus(
            @PathVariable int status,
            @RequestHeader("Token") String token)
    {
        return AS.getAssignmentsByStatus(status, token);
    }

    @PostMapping("/user")
    public Object getAssignmentsByUser(
            @RequestBody Users user,
            @RequestHeader("Token") String token)
    {
        return AS.getAssignmentsByUser(user, token);
    }

    @PutMapping("/update/{id}")
    public Object updateAssignment(
            @PathVariable int id,
            @RequestBody Assignments assignment,
            @RequestHeader("Token") String token)
    {
        return AS.updateAssignment(id, assignment, token);
    }

    @DeleteMapping("/delete/{id}")
    public Object deleteAssignment(
            @PathVariable int id,
            @RequestHeader("Token") String token)
    {
        return AS.deleteAssignment(id, token);
    }
}