package uk.co.alkanani.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import uk.co.alkanani.json.FileJson;
import uk.co.alkanani.json.FilesJson;

import java.util.Arrays;

@RestController
@RequestMapping(path = "/files")
public class FileController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public FilesJson getFiles() {
        FilesJson testFiles = new FilesJson();
        FileJson file1 = new FileJson();
        FileJson file2 = new FileJson();
        file1.name = "file_1";
        file1.unixTime = 1L;
        file2.name = "file_2";
        file2.unixTime = 2L;
        testFiles.files = Arrays.asList(file1, file2);
        return testFiles;
    }
}
