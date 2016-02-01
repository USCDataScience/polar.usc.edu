package edu.usc.polar;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;

public class Polar extends WebPage {
    public Polar() {
        add(new Label("message", "Polar Deep Search Engine!"));
    }
}