package uk.co.alkanani.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import uk.co.alkanani.json.DirectoryJson;

import java.util.Arrays;

@RestController
@RequestMapping(path = "/directories")
public class DirectoryController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public DirectoryJson getDirectories() {
        DirectoryJson testRoot = new DirectoryJson();
        DirectoryJson child1 = new DirectoryJson();
        DirectoryJson child2 = new DirectoryJson();
        DirectoryJson child3 = new DirectoryJson();
        child1.name = "child_1";
        child2.name = "child_2";
        child3.name = "child_3";
        testRoot.subDirectories = Arrays.asList(child1, child2, child3);
        return testRoot;
    }
}
