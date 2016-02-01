package edu.usc.polar;
import org.apache.wicket.protocol.http.WebApplication;

public class PolarApplication extends WebApplication {
    public PolarApplication() {
    }
    /**
     * @see org.apache.wicket.Application#getHomePage()
     */
    @Override
    public Class getHomePage() {
        return Polar.class;
    }
}