package uk.co.alkanani.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import uk.co.alkanani.file.DirectoryUtil;
import uk.co.alkanani.json.DirectoryJson;

@RestController
@RequestMapping(path = "/directories")
public class DirectoryController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public DirectoryJson getDirectories() {
        return DirectoryUtil.buildDirectoryJsonTree();
    }
}
