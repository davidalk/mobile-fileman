package uk.co.alkanani.json;

import java.util.ArrayList;
import java.util.List;

public class DirectoryJson {
    public String name;
    public List<DirectoryJson> subDirectories;

    public DirectoryJson() {
        subDirectories = new ArrayList<>();
    }
}
